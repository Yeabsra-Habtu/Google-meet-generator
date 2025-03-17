import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Stack,
  InputAdornment,
  Paper,
  Typography,
  alpha,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, addHours } from "date-fns";
import EventIcon from "@mui/icons-material/Event";

// Add custom styles for the date picker
import { styled } from "@mui/material/styles";

const StyledDatePickerWrapper = styled(Box)(`
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
`);
// time icon
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";

interface ScheduleMeetingFormProps {
  onScheduleMeeting: (data: {
    title: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: string[];
  }) => void;
  disabled: boolean;
}

const ScheduleMeetingForm = ({
  onScheduleMeeting,
  disabled,
}: ScheduleMeetingFormProps) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendeeInput, setAttendeeInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startDate) return;

    const endDate = addMinutes(startDate, duration);

    onScheduleMeeting({
      title,
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      attendees: attendees.length > 0 ? attendees : undefined,
    });

    // Reset form
    setTitle("");
    setStartDate(new Date());
    setDuration(30);
    setAttendees([]);
    setAttendeeInput("");
  };

  const handleAddAttendee = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear previous error
    setEmailError(null);

    if (!attendeeInput) {
      return;
    }

    if (!emailRegex.test(attendeeInput)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (attendees.includes(attendeeInput)) {
      setEmailError("This email is already added");
      return;
    }

    // Valid email, add to attendees list
    setAttendees([...attendees, attendeeInput]);
    setAttendeeInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAttendee();
    }
  };

  // Check if email is valid
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== "" && emailRegex.test(email);
  };

  // Clear error when user starts typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttendeeInput(e.target.value);
    if (emailError) setEmailError(null);
  };

  const handleDeleteAttendee = (attendeeToDelete: string) => {
    setAttendees(attendees.filter((attendee) => attendee !== attendeeToDelete));
  };

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: (theme) =>
          `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: (theme) =>
            `0 12px 28px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 500, color: "text.primary" }}
      >
        Schedule Your Meeting
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&.Mui-focused": {
                  boxShadow: (theme) =>
                    `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledDatePickerWrapper
            sx={{ display: "flex", alignItems: "center", width: "100%" }}
          >
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              isClearable
              wrapperClassName="datepicker-no-border"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              customInput={
                <TextField
                  fullWidth
                  label="Date and Time"
                  disabled={disabled}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              }
            />
          </StyledDatePickerWrapper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            inputProps={{ min: 15, step: 15 }}
            disabled={disabled}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Add Attendees"
            placeholder="Enter email address"
            value={attendeeInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            error={!!emailError}
            helperText={emailError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleAddAttendee}
                    disabled={disabled}
                    size="small"
                    startIcon={<PersonAddIcon />}
                  >
                    Add
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {attendees.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {attendees.map((attendee) => (
                  <Chip
                    key={attendee}
                    label={attendee}
                    onDelete={() => handleDeleteAttendee(attendee)}
                    disabled={disabled}
                    sx={{ mt: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={disabled || !title || !startDate}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: (theme) =>
                `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: (theme) =>
                  `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            Schedule Meeting
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ScheduleMeetingForm;
