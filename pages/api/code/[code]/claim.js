import CodeRepository from "../../../../lib/code_repository";
import Contract from "../../../../lib/contract";

const repository = new CodeRepository();
const contract = new Contract();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { code, pass_code } = req.query;
        const { address } = req.body;

        if (!pass_code || pass_code !== process.env.PASS_CODE) {
            return res.status(400).json({ error: "Code cannot be confirmed." });
        }

        const foundCode = await repository.isValid(code);
        if (!foundCode) {
            return res.status(400).json({ error: "Code has already been claimed." });
        }

        try {
            const tx = await contract.claim(address, code);
            const receipt = await tx.wait();
            return res.status(200).json(receipt);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    return res.status(404);
}
