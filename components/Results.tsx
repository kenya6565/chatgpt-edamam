import { Fragment } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  ListItem,
  ListItemText,
  List,
} from '@mui/material';

type Message = {
  content: string;
};

type Article = {
  title: string;
  url: string;
};

type ResultsProps = {
  openAPIResponse: Message | null;
  qiitaAPIResponse: Article[];
};

const Results = ({ openAPIResponse, qiitaAPIResponse }: ResultsProps) => (
  <Fragment>
    {openAPIResponse && (
      <Paper elevation={3}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            ChatGPT
          </Typography>
          <ListItemText primary={openAPIResponse.content} />
        </Box>
      </Paper>
    )}
    {qiitaAPIResponse.length > 0 && (
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
    )}
  </Fragment>
);

export default Results;
