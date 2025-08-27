// src/components/negotiation-chat.tsx
"use client";

import { useState } from "react";
import type { NegotiationMessage } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

type NegotiationChatProps = {
    messages: NegotiationMessage[];
    onSendMessage: (content: string) => void;
    currentUserId: string;
};

export function NegotiationChat({ messages, onSendMessage, currentUserId }: NegotiationChatProps) {
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage("");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chat de Negociación</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72 w-full pr-4">
                    <div className="space-y-4">
                        {messages.length > 0 ? (
                             messages.map((msg, index) => (
                                <div key={index} className={cn("flex items-end gap-2", msg.senderId === currentUserId ? "justify-end" : "justify-start")}>
                                     <div className={cn(
                                         "max-w-xs rounded-lg px-4 py-2 text-sm",
                                         msg.senderId === currentUserId 
                                         ? "bg-primary text-primary-foreground" 
                                         : "bg-muted"
                                     )}>
                                        <p>{msg.content}</p>
                                        <p className={cn("text-xs mt-1", msg.senderId === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                            {format(new Date(msg.timestamp), 'p', { locale: es })}
                                        </p>
                                     </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-16">
                                <p>No hay mensajes todavía. ¡Inicia la conversación!</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <div className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend}>
                        <Send className="mr-2 h-4 w-4" /> Enviar
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
