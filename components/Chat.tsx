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

type Article = {
  title: string;
  url: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [openAPIResponse, setOpenAPIResponse] = useState<Message | null>(null);
  const [qiitaAPIResponse, setQiitaAPIResponse] = useState<Message[]>([]);

  const sendMessageToOpenAI = async () => {
    const userMessage: Message = { role: 'user', content: input };
    setMessages([userMessage]);
    setOpenAPIResponse(null);
    setQiitaAPIResponse([]);

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

    const openAPIResponse: Message = {
      role: 'assistant',
      content: dataOpenAPI.chat.choices[0].text,
    };

    const qiitaArticles = dataQiitaAPI.articles.map((article: Article) => {
      const articleMessage: Message = {
        role: 'assistant',
        content: `Title: ${article.title}, URL: ${article.url}`,
      };
      return articleMessage;
    });

    setMessages([userMessage]);
    setOpenAPIResponse(openAPIResponse);
    setQiitaAPIResponse(qiitaArticles);
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
          {openAPIResponse && (
            <ListItem>
              <ListItemText
                primary={openAPIResponse.role}
                secondary={openAPIResponse.content}
              />
            </ListItem>
          )}
          {qiitaAPIResponse.map((message, index) => (
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
