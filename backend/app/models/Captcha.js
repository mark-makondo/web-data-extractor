import { model, Schema } from 'mongoose';

const Captcha = Schema(
    {
        origin: { type: Schema.Types.String },
        page_content: { type: Schema.Types.String },
        result: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    }
);

export default model('captchas', Captcha);
