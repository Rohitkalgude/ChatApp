import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseensMessage, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const allUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("/api/v1/message/allusers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseensMessage || {});
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    }
  };

  const getMessage = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`/api/v1/message/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        const formatted = data.messages.map((msg) => ({
          ...msg,
          sender: msg.senderId === userId ? "other" : "me",
        }));

        setMessages(formatted);
        setSelectedUser(userId);
        markRead(userId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "getMessages users");
    }
  };

  const sendMessage = async (userId, text, image) => {
    try {
      const { data } = await axios.post(
        `/api/v1/message/sendmessage/${userId}`,
        {
          text,
          image,
        }
      );

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { ...data.newMessage, sender: "me", seen: false },
        ]);

        socket.emit("sendMessage", data.newMessage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Sendmessage users");
    }
  };

  const markRead = async (userId) => {
    try {
      const { data } = await axios.put(`/api/v1/message/markread/${userId}`);

      if (data.success) {
        setUnseenMessages((prev) => ({ ...prev, [userId]: 0 }));
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === "me" ? { ...msg, seen: true } : msg
          )
        );

        socket.emit("messagesSeen", { userId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "markRead users");
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const { data } = await axios.delete(`/api/v1/message/delete`, {
        data: { messageId },
      });

      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      if (message.senderId === selectedUser) {
        setMessages((prev) => [...prev, message]);
        markRead(selectedUser);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
      }
    });

    socket.on("messageDeleted", (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    socket.on("messagesSeen", ({ userId }) => {
      if (userId === selectedUser) {
        setMessages((prev) => prev.map((msg) => ({ ...msg, seen: true })));
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("messagesSeen");
    };
  }, [socket, selectedUser]);

  const value = {
    axios,
    socket,
    users,
    messages,
    selectedUser,
    unseensMessage,
    allUser,
    getMessage,
    sendMessage,
    markRead,
    deleteMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
