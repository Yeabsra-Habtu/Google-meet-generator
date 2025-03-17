import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

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

interface MeetingState {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
}

const initialState: MeetingState = {
  meetings: [],
  loading: false,
  error: null,
};

export const meetingSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.unshift(action.payload);
    },
    clearMeetings: (state) => {
      state.meetings = [];
    },
  },
});

export const { setLoading, setError, addMeeting, clearMeetings } =
  meetingSlice.actions;

export const selectMeetings = (state: RootState) => state.meetings.meetings;
export const selectMeetingLoading = (state: RootState) =>
  state.meetings.loading;
export const selectMeetingError = (state: RootState) => state.meetings.error;

export default meetingSlice.reducer;
