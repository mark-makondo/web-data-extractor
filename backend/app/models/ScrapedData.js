import { model, Schema } from 'mongoose';

const ScrapedData = Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        origin: { type: Schema.Types.String },
        title: { type: Schema.Types.String },
        savedDoc: [{ type: Schema.Types.Mixed }],
    },
    {
        timestamps: true,
    }
);

export default model('scrapedData', ScrapedData);
