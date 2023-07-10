import React, { Fragment } from 'react';
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
  created_at: string;
  likes_count: number;
};

const Chat = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openAPIResponse, setOpenAPIResponse] = useState<Message | null>(null);
  const [qiitaAPIResponse, setQiitaAPIResponse] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page > 1) {
      const fetchQiita = async () => {
        setIsLoading(true);
        setSearched(true);

        const resQiitaAPI = await fetch(
          `https://qiita.com/api/v2/items?query=${input}&page=${page}`,
          {
            method: 'GET',
          },
        );

        // Check for response status and update state with new data
        if (resQiitaAPI.ok) {
          const dataQiitaAPI = await resQiitaAPI.json();

          const qiitaArticles: Article[] = dataQiitaAPI
            .filter((article: Article) =>
              article.title.toLowerCase().includes(input.toLowerCase()),
            )
            .map((article: Article) => {
              return {
                title: article.title,
                url: article.url,
                created_at: article.created_at,
                likes_count: article.likes_count,
              };
            });

          setQiitaAPIResponse(qiitaArticles);
        } else {
          setError('Something went wrong. Please try again.');
        }

        setIsLoading(false);
      };
      fetchQiita();
    }
  }, [page]);

  const sendMessageToOpenAI = async () => {
    setError(null);

    if (input.length === 0) {
      setError('Please enter a search term.');
      return;
    }

    // Reset the state before sending the new request
    setOpenAPIResponse(null);
    setQiitaAPIResponse([]);
    setIsLoading(true);
    setSearched(true);

    const resOpenAPI = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const resQiitaAPI = await fetch(
      `https://qiita.com/api/v2/items?query=${input}&page=${page}`,
      {
        method: 'GET',
      },
    );

    let dataOpenAPI;
    let dataQiitaAPI;

    if (resOpenAPI.ok && resQiitaAPI.ok) {
      try {
        dataOpenAPI = await resOpenAPI.json();
        dataQiitaAPI = await resQiitaAPI.json();
      } catch (err) {
        console.error('Failed to parse response:', err);
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
            created_at: article.created_at,
            likes_count: article.likes_count,
          };
        });

      setOpenAPIResponse(openAPIResponse);
      setQiitaAPIResponse(qiitaArticles);
    } else {
      setError('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  const goToNextPage = () => {
    setPage(page + 1);
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
                cursor: 'pointer',
              }}
              onClick={() => window.location.reload()}
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

          {!isLoading && openAPIResponse && (
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

          {!isLoading && searched && qiitaAPIResponse.length > 0 ? (
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
                            secondary={
                              <Typography variant="body2" color="textSecondary">
                                作成日:
                                {new Date(
                                  article.created_at,
                                ).toLocaleDateString()}{' '}
                                • {article.likes_count}いいね
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
          ) : searched && !isLoading && qiitaAPIResponse.length === 0 ? (
            <Grid item xs={12} sm={8} md={10}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Qiita
                  </Typography>
                  <Divider />
                  <Typography variant="body1">
                    ごめんなさい、Qiitaではお探しの結果は見つかりませんでした。
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
        <Grid item xs={12} sm={8} md={10}>
          <Box
            display="flex"
            justifyContent="center"
            marginTop={2}
            marginBottom={2}
          >
            {!isLoading && searched && qiitaAPIResponse.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={goToNextPage}
              >
                次のページ
              </Button>
            )}
          </Box>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
export default Chat;
