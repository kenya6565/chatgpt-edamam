import { Box, Button, TextField } from '@mui/material';

type SearchBarProps = {
  input: string;
  setInput: (input: string) => void;
  sendMessageToOpenAI: () => Promise<void>;
};

const SearchBar = ({
  input,
  setInput,
  sendMessageToOpenAI,
}: SearchBarProps) => (
  <>
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
  </>
);

export default SearchBar;
