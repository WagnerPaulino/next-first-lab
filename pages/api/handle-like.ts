import { sanityClient } from "../../lib/sanity";
import { Recipe } from "../../models/recipe";

sanityClient.config({
    token: process.env.SANITY_WRITE_TOKEN
})

export default async function likeButtonHandler(req: any, res: any) {
    const { _id } = JSON.parse(req.body);
    const data = await sanityClient
        .patch(_id)
        .setIfMissing({ likes: 0 })
        .inc({ likes: 1 })
        .commit<Recipe>()
        .catch((error) => console.log(error)) as Recipe;

    res.status(200).json({ likes: data.likes });
}
