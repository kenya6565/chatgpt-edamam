import { useState } from 'react';
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
  const [openAPIResponse, setOpenAPIResponse] = useState('');
  const [qiitaAPIResponse, setQiitaAPIResponse] = useState('');

  const sendMessageToOpenAI = async () => {
    const userMessage: Message = { role: 'user', content: input };

    // send the user input to both OpenAPI and Qiita API
    const resOpenAPI = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage.content }),
    });

    const resQiitaAPI = await fetch('/api/qiita', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword: userMessage.content }),
    });

    const dataOpenAPI = await resOpenAPI.json();
    const dataQiitaAPI = await resQiitaAPI.json();

    setOpenAPIResponse(dataOpenAPI.chat.choices[0].text.trim());

    const qiitaArticles = dataQiitaAPI.articles.map((article: any) => {
      const articleMessage: Message = {
        role: 'assistant',
        content: `Title: ${article.title}, URL: ${article.url}`,
      };
      return articleMessage;
    });

    setMessages([...messages, userMessage, ...qiitaArticles]);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
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
        <div>
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
          >
            Send
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
