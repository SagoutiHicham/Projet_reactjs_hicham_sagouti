'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Stat = { name: string; value: number };
type Evolution = { id: number; name: string; image: string };
type Type = { id: number; name: string; image: string };

type PokemonDetail = {
    id: number;
    name: string;
    image: string;
    stats: Stat[] | null;
    evolutions: Evolution[] | null;
    types: Type[] | null;
};

export default function PokemonDetail() {
    const { id } = useParams() as { id: string };
    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`https://nestjs-pokedex-api.vercel.app/pokemons/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const stats = Object.entries(data.stats || {})
                    .filter(([key]) => !key.includes('_')) // Supprimer les doublons 
                    .map(([key, value]) => ({ name: key, value }));

                setPokemon({
                    ...data,
                    stats,
                });
            });
    }, [id]);

    if (!pokemon) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold text-gray-500">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link
                href="/"
                className="inline-block px-6 py-2 mb-6 text-white bg-blue-500 hover:bg-blue-600 rounded shadow"
            >
                Retour à la liste
            </Link>

            <div className="border p-6 rounded shadow-lg bg-white">
                {/* Image et Nom */}
                <div className="flex flex-col items-center">
                    <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                '/placeholder-image.png'; 
                        }}
                        className="mb-4 w-32 h-32 object-contain"
                    />
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        {pokemon.name}
                    </h1>
                </div>

                {/* Types */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Types</h2>
                    {Array.isArray(pokemon.types) && pokemon.types.length > 0 ? (
                        <div className="flex gap-4">
                            {pokemon.types.map((type) => (
                                <div
                                    key={type.id}
                                    className="flex flex-col items-center bg-gray-50 border rounded p-4 shadow-sm"
                                >
                                    <img
                                        src={type.image}
                                        alt={type.name}
                                        className="w-16 h-16 mb-2 object-contain"
                                    />
                                    <p className="font-semibold text-gray-800">{type.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Types indisponibles pour ce Pokémon.
                        </p>
                    )}
                </div>

                {/* Statistiques */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Statistiques</h2>
                    {Array.isArray(pokemon.stats) && pokemon.stats.length > 0 ? (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {pokemon.stats.map((stat) => (
                                <li
                                    key={stat.name}
                                    className="bg-gray-100 rounded p-3 text-center shadow-sm"
                                >
                                    <span className="block font-bold text-lg text-gray-800">
                                        {stat.name}
                                    </span>
                                    <span className="text-gray-600">{stat.value}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">
                            Statistiques indisponibles pour ce Pokémon.
                        </p>
                    )}
                </div>

                {/* Évolutions */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Évolutions</h2>
                    {Array.isArray(pokemon.evolutions) && pokemon.evolutions.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {pokemon.evolutions.map((evolution) => {
                          
                                const evolutionImage =
                                    evolution.image ||
                                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.pokedexId}.png`;

                                return (
                                    <div
                                        key={evolution.id}
                                        className="flex flex-col items-center bg-gray-50 border rounded p-4 shadow-sm"
                                    >
                                        <img
                                            src={evolutionImage}
                                            alt={evolution.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    '/placeholder-image.png'; // Image de secours
                                            }}
                                            className="w-20 h-20 mb-2 object-contain"
                                        />
                                        <p className="font-semibold text-gray-800">{evolution.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Évolutions indisponibles pour ce Pokémon.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
