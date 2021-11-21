// export default async (req, res) => {
//     const { method } = req;

//     // This will allow OPTIONS request
//     if (method === "OPTIONS") {
//         return res.status(200).send("ok");
//     }
// }


import nextConnect from 'next-connect';

const handler = nextConnect();

handler.options(async (req: any, res: any) => {
    return res.status(200).send("ok");
});

export default handler;
