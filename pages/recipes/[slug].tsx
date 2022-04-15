import { PortableText } from "@portabletext/react";
import { NextPage } from "next";
import { useState } from "react";
import { sanityClient, urlFor, usePreviewSubscription } from "../../lib/sanity";
import { Recipe } from "../../models/recipe";

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes
}`;

interface Param {
    params: { slug: string };
}

const UnorderList = ({ recipe }: { recipe: Recipe }) => {
    return (
        <ul className="ingredients">
            {recipe.ingredient?.length > 0 && recipe.ingredient.map((ingredient) => (
                <li className="ingredient" key={ingredient?._key}>
                    {ingredient?.wholeNumber} {ingredient?.fraction} {ingredient?.unit}
                    <br />
                    {ingredient?.ingredient?.name}
                </li>
            ))}
        </ul>
    )
}


const OneRecipe: NextPage = ({ data, preview }: any) => {
    console.log(data)
    const { data: recipe } = usePreviewSubscription<Recipe>(recipeQuery, {
        params: { slug: data.recipe.slug.current },
        initialData: data.recipe,
        enabled: preview
    });
    const [likes, setLikes] = useState<number>(recipe.likes);
    const addLike = async () => {
        const res = await fetch("/api/handle-like", {
            method: "POST",
            body: JSON.stringify({ _id: recipe._id })
        }).catch(console.log) as Response;
        const data = await res.json();
        setLikes(data.likes);
    }
    return (
        <article className="recipe">
            <h1>{recipe.name}</h1>
            <button className="like-button" onClick={addLike}>likes: {likes}</button>
            <main className="content">
                <img src={urlFor(recipe.mainImage).url()} alt={recipe.name} />
                <div className="breakdown">
                    <UnorderList recipe={recipe} />
                    <PortableText value={recipe.instructions} />
                </div>
            </main>
        </article>
    )
}

export async function getStaticPaths() {
    const paths = await sanityClient.fetch<Param[]>(
        `*[_type == "recipe" && defined(slug.current)]{
            "params": {
                "slug": slug.current
            }
        }`
    );
    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }: Param) {
    const { slug } = params;
    const recipe = await sanityClient.fetch(recipeQuery, { slug }) as Recipe;
    return {
        props: { data: { recipe }, preview: true }
    }
}

export default OneRecipe;