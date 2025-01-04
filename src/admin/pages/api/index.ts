import nextConnect from 'next-connect';

const handler = nextConnect();

handler.options(async (req: any, res: any) => {
    return res.status(200).send('ok');
});

export default handler;
