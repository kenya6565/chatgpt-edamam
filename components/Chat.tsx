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
  Paper,
  Box,
  Grid,
  Link,
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
  const [qiitaAPIResponse, setQiitaAPIResponse] = useState<Article[]>([]);

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

    const resQiitaAPI = await fetch(
      `https://qiita.com/api/v2/items?query=${input}`,
      {
        method: 'GET',
      },
    );

    let dataOpenAPI;
    let dataQiitaAPI;

    try {
      dataOpenAPI = await resOpenAPI.json();
    } catch (err) {
      console.error('Failed to parse Open AI response:', err);
    }

    try {
      dataQiitaAPI = await resQiitaAPI.json();
    } catch (err) {
      console.error('Failed to parse Qiita response:', err);
    }

    const openAPIResponse: Message = {
      content: dataOpenAPI.chat.choices[0].text,
    };

    const qiitaArticles: Article[] = dataQiitaAPI.map((article: Article) => {
      return {
        title: article.title,
        url: article.url,
      };
    });

    setOpenAPIResponse(openAPIResponse);
    setQiitaAPIResponse(qiitaArticles);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h4" component="h1" gutterBottom>
                どのような記事をお探しですか？
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendMessageToOpenAI}
                >
                  Send
                </Button>
              </Box>
              {openAPIResponse && (
                <>
                  <Typography variant="h6" gutterBottom>
                    ChatGPT
                  </Typography>
                  <ListItemText primary={openAPIResponse.content} />
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        {qiitaAPIResponse.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box p={2}>
                <Typography variant="h6">Qiita</Typography>
                <List>
                  {qiitaAPIResponse.map((article, index) => (
                    <ListItem key={index}>
                      <ListItemText>
                        <Typography variant="body1">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {article.title}
                          </a>
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
};
export default Chat;
