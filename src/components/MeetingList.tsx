import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Divider,
  Chip,
  Link,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

interface Meeting {
  id: string;
  link: string;
  title?: string;
  dateTime?: string;
  isInstant: boolean;
  createdAt: string;
  attendees?: string[];
  duration?: number | null;
}

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList = ({ meetings }: MeetingListProps) => {
  if (meetings.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="subtitle1" color="text.secondary">
          No meetings created yet. Create an instant meeting or schedule one for
          later.
        </Typography>
      </Box>
    );
  }
  console.log(meetings);
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Your Meetings
      </Typography>
      <Paper elevation={2}>
        <List>
          {meetings.map((meeting, index) => (
            <Box key={meeting.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {meeting.title || "Instant Meeting"}
                  </Typography>
                  <Chip
                    size="small"
                    color={meeting.isInstant ? "secondary" : "primary"}
                    label={meeting.isInstant ? "Instant" : "Scheduled"}
                  />
                </Box>

                {!meeting.isInstant && meeting.dateTime && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Scheduled for:{" "}
                      {new Date(meeting.dateTime).toLocaleString()}
                    </Typography>
                    {meeting.duration && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Duration: {meeting.duration} minutes
                      </Typography>
                    )}
                  </Box>
                )}

                <Link
                  href={meeting.link}
                  target="_blank"
                  rel="noopener"
                  sx={{ mb: 1 }}
                >
                  {meeting.link}
                </Link>

                <Typography variant="caption" color="text.secondary">
                  Created {formatDistanceToNow(new Date(meeting.createdAt))} ago
                </Typography>

                {meeting.attendees && meeting.attendees.length > 0 && (
                  <Box sx={{ mt: 1, width: "100%" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Attendees:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {meeting.attendees.map((email) => (
                        <Chip
                          key={email}
                          size="small"
                          label={email}
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </ListItem>
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MeetingList;
