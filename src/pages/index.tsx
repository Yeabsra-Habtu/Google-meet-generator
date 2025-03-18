import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  clearUser,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import {
  addMeeting,
  setLoading,
  setError,
  selectMeetings,
  selectMeetingLoading,
} from "@/store/slices/meetingSlice";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Avatar,
  CircularProgress,
  alpha,
  Tabs,
  Tab,
} from "@mui/material";
import InstantMeetingButton from "@/components/InstantMeetingButton";
import ScheduleMeetingForm from "@/components/ScheduleMeetingForm";
import MeetingList from "@/components/MeetingList";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Home() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const meetings = useSelector(selectMeetings);
  const isLoading = useSelector(selectMeetingLoading);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          name: session.user.name || undefined,
          email: session.user.email || undefined,
          image: session.user.image || undefined,
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(clearUser());
    }
  }, [session, status, dispatch]);

  const handleCreateInstantMeeting = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await fetch("/api/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isInstant: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to create instant meeting");
      }

      const meetingData = await response.json();
      dispatch(addMeeting(meetingData));
    } catch (error) {
      console.error("Error creating instant meeting:", error);
      dispatch(setError("Failed to create instant meeting"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleScheduleMeeting = async (data: {
    title: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: string[];
  }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await fetch("/api/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          isInstant: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule meeting");
      }

      const meetingData = await response.json();
      dispatch(addMeeting(meetingData));
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      dispatch(setError("Failed to schedule meeting"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (status === "loading") {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            background: "linear-gradient(45deg, #000, #000 )",
            backgroundClip: "text",
            textFillColor: "transparent",
            textAlign: "center",
            mb: 1,
          }}
        >
          Google Meet Generator
        </Typography>

        {!isAuthenticated ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              mt: 6,
              borderRadius: 3,
              backdropFilter: "blur(8px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(31,38,135,0.15)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 48px rgba(31,38,135,0.25)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, #1a73e8 30%, #8ab4f8 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  textAlign: "center",
                  mb: 1,
                }}
              >
                Welcome to Google Meet Generator
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  maxWidth: 400,
                  mb: 2,
                }}
              >
                Create and manage your meetings effortlessly with our intuitive
                interface
              </Typography>
              <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={() => signIn("google")}
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  background:
                    "linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)",
                  boxShadow: "0 3px 12px rgba(26,115,232,0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.02)",
                    boxShadow: "0 6px 20px rgba(26,115,232,0.4)",
                  },
                  "&:active": {
                    transform: "translateY(1px)",
                  },
                }}
              >
                Sign in with Google
              </Button>
            </Box>
          </Paper>
        ) : (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {session?.user?.image && (
                  <Avatar
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    sx={{ mr: 1 }}
                  />
                )}
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {session?.user?.name}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 60%" } }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Create a Meeting
                  </Typography>

                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.04),
                    }}
                  >
                    <Tab label="Instant Meeting" />
                    <Tab label="Schedule Meeting" />
                  </Tabs>

                  <Box sx={{ mt: 3 }}>
                    {activeTab === 0 ? (
                      <InstantMeetingButton
                        onCreateInstantMeeting={handleCreateInstantMeeting}
                        disabled={isLoading}
                      />
                    ) : (
                      <ScheduleMeetingForm
                        onScheduleMeeting={handleScheduleMeeting}
                        disabled={isLoading}
                      />
                    )}
                  </Box>
                </Paper>

                {isLoading && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  flex: { xs: "1 1 100%", md: "1 1 40%" },
                  height: { md: "calc(100vh - 200px)" },
                  overflow: "auto",
                }}
              >
                <MeetingList meetings={meetings} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
