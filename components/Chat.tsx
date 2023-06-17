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
  content: string;
};

type Article = {
  title: string;
  url: string;
};

const Chat = () => {
  const [input, setInput] = useState('');
  const [openAPIResponse, setOpenAPIResponse] = useState<Message | null>(null);
  const [qiitaAPIResponse, setQiitaAPIResponse] = useState<Message[]>([]);

  const sendMessageToOpenAI = async () => {
    // Reset the state before sending the new request
    setOpenAPIResponse(null);
    setQiitaAPIResponse([]);

    const resOpenAPI = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const resQiitaAPI = await fetch('/api/qiita', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword: input }),
    });

    const dataOpenAPI = await resOpenAPI.json();
    const dataQiitaAPI = await resQiitaAPI.json();

    const openAPIResponse: Message = {
      content: dataOpenAPI.chat.choices[0].text,
    };

    const qiitaArticles = dataQiitaAPI.articles.map((article: Article) => {
      const articleMessage: Message = {
        content: `Title: ${article.title}, URL: ${article.url}`,
      };
      return articleMessage;
    });

    setOpenAPIResponse(openAPIResponse);
    setQiitaAPIResponse(qiitaArticles);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          どのような記事をお探しですか？
        </Typography>
        <Typography variant="h6">検索されたワード: {input}</Typography>
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
        {openAPIResponse && (
          <>
            <Typography variant="h6">ChatGPT</Typography>
            <ListItemText primary={openAPIResponse.content} />
          </>
        )}
        {qiitaAPIResponse.length > 0 && (
          <>
            <Typography variant="h6">Qiita</Typography>
            <List>
              {qiitaAPIResponse.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText primary={message.content} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Chat;
