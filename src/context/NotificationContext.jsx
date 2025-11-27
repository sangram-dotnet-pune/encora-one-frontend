import React, { createContext, useEffect, useState, useContext } from 'react';
import * as signalR from '@microsoft/signalr';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Create Connection
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7001/notificationHub") // Your API URL
            .withAutomaticReconnect()
            .build();

        // Start Connection
        connection.start()
            .then(() => console.log("SignalR Connected"))
            .catch(err => console.error("SignalR Connection Error: ", err));

        // Listen for Messages
        connection.on("ReceiveNotification", (message) => {
            const newNotification = {
                id: Date.now(),
                message: message,
                time: new Date().toLocaleTimeString()
            };
            
            setNotifications(prev => [newNotification, ...prev]);

            // Auto remove after 5 seconds
            setTimeout(() => {
                removeNotification(newNotification.id);
            }, 5000);
        });

        return () => {
            connection.stop();
        };
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);