import Session from "express-session";
import filestore from "session-file-store";

const FileStore = filestore(Session);

export default Session({
  store: new FileStore({
    path: "storage/sessions",
    ttl: 60 * 60,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 60 * 60 * 1000,
  },
});
