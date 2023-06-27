import React, { Fragment } from 'react';
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
  CircularProgress,
  Divider,
  Container,
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
  const [isLoading, setIsLoading] = useState(false);
  const [openAPIResponse, setOpenAPIResponse] = useState<Message | null>(null);
  const [qiitaAPIResponse, setQiitaAPIResponse] = useState<Article[]>([]);

  const sendMessageToOpenAI = async () => {
    // Reset the state before sending the new request
    setOpenAPIResponse(null);
    setQiitaAPIResponse([]);
    setIsLoading(true);

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

    const qiitaArticles: Article[] = dataQiitaAPI
      .filter((article: Article) =>
        article.title.toLowerCase().includes(input.toLowerCase()),
      )
      .map((article: Article) => {
        return {
          title: article.title,
          url: article.url,
        };
      });

    setOpenAPIResponse(openAPIResponse);
    setQiitaAPIResponse(qiitaArticles);
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8} md={10}>
            <Typography
              align="center"
              style={{
                fontFamily: 'Roboto',
                fontSize: '2em',
                fontWeight: 'bold',
                marginTop: '20px',
              }}
            >
              Qiita GPT
            </Typography>
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
                  InputProps={{
                    autoComplete: 'off',
                  }}
                />
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={sendMessageToOpenAI}
                    disabled={input.length === 0}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
          {isLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
              <Typography ml={2}>少々お待ちください...</Typography>
            </Box>
          )}

          {openAPIResponse && (
            <Grid item xs={12} sm={8} md={10}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    ChatGPT
                  </Typography>
                  <ListItemText primary={openAPIResponse.content} />
                </Box>
              </Paper>
            </Grid>
          )}

          {qiitaAPIResponse.length > 0 && (
            <Grid item xs={12} sm={8} md={10}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Qiita
                  </Typography>
                  <Divider />
                  <List>
                    {qiitaAPIResponse.map((article, index) => (
                      <Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography variant="body1">
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {article.title}
                                </a>
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </Fragment>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
export default Chat;
