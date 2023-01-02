import express from 'express'
import mongoose from 'mongoose'
import authRouter from "./routes/authRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import dotenv from "dotenv";
import cors from 'cors'
import {corsMiddleware} from "./middleware/cors.middleware.js";
import tagsRouter from "./routes/tagsRouter.js";
import bodyParser from 'body-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import "./passportAuth/passport.js"

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()


const corsOptions = {
    origin: ['https://front-fourth.vercel.app',
             'http://localhost:3000',
        'https://tatiankris.github.io/just-review-front'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
}


app.use(
    cookieSession({ name: "session", keys: ["myReview"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOptions))
// app.use(corsMiddleware)
const jsonParser = bodyParser.json({limit:'5mb', type:'application/json'});
const urlencodedParser = bodyParser.urlencoded({ extended:true,limit:'4mb',type:'application/x-www-form-urlencoded' });
app.use(jsonParser);
app.use(urlencodedParser);

app.use(express.json())

app.use('/auth', authRouter)
app.use('/reviews', reviewsRouter)
app.use('/tags', tagsRouter)
mongoose.set('strictQuery', true);


const start = async () => {
    try {
         await mongoose.connect("mongodb+srv://tatiana:tatiana@cluster0.f3fznh6.mongodb.net/course-proj?retryWrites=true&w=majority")
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
export default app;