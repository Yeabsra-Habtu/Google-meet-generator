import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";

interface InstantMeetingButtonProps {
  onCreateInstantMeeting: () => void;
  disabled: boolean;
}

const InstantMeetingButton = ({
  onCreateInstantMeeting,
  disabled,
}: InstantMeetingButtonProps) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      fullWidth
      startIcon={<VideocamIcon />}
      onClick={onCreateInstantMeeting}
      disabled={disabled}
      sx={{ py: 1.5 }}
    >
      Create Instant Meeting
    </Button>
  );
};

export default InstantMeetingButton;
