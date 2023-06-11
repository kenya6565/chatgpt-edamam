import { useState, useEffect } from 'react';
import theme from '../src/theme';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  ThemeProvider,
} from '@mui/material';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [assistantText, setAssistantText] = useState('');

  const sendMessageToOpenAI = async () => {
    const userMessage: Message = { role: 'user', content: input };

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage.content }),
    });

    const data = await res.json();

    setAssistantText(data.chat.choices[0].text.trim());

    setMessages([...messages, userMessage]);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      if (assistantText !== '') {
        const res = await fetch('/api/qiita', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword: assistantText }),
        });

        const data = await res.json();

        data.articles.forEach((article: any) => {
          const articleMessage: Message = {
            role: 'assistant',
            content: `Title: ${article.title}, URL: ${article.url}`,
          };
          setMessages((prevMessages) => [...prevMessages, articleMessage]);
        });
      }
    };

    fetchArticles();
  }, [assistantText]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          どのような記事をお探しですか？
        </Typography>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={message.role}
                secondary={message.content}
              />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessageToOpenAI}
            style={{ marginLeft: '10px' }}
          >
            Send
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
