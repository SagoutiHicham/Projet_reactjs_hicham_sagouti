'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Pokemon = {
  id: number;
  name: string;
  types: { id: number; name: string; image: string }[];
  image: string;
};

type PokemonType = { id: number; name: string };

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]); 
  const [types, setTypes] = useState<PokemonType[]>([]); 
  const [page, setPage] = useState(1); 
  const [limit, setLimit] = useState(50); 
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState(''); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetch('https://nestjs-pokedex-api.vercel.app/types')
      .then((res) => res.json())
      .then(setTypes);
  }, []);

  useEffect(() => {
    setPage(1); // Réinitialiser la pagination à la première page
    fetchPokemons(true);
  }, [filterName, filterType, limit]);

  useEffect(() => {
    if (page > 1) fetchPokemons(false);
  }, [page]);

  // Fonction pour récupérer les Pokémon de l'api
  const fetchPokemons = (reset: boolean) => {
    if (loading) return;

    setLoading(true);

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filterName) params.append('name', filterName); 
    if (filterType) params.append('typeId', filterType); 

    fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?${params.toString()}`)
      .then((res) => res.json())
      .then((newPokemons) => {
        setPokemons((prev) =>
          reset ? newPokemons : [...prev, ...newPokemons] // Réinitialiser ou ajouter
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 500 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1); 
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="p-6">
      {/* Header rouge */}
      <h1 className="text-3xl font-bold mb-6 text-red-600">Pokedex</h1>
      
      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={filterName}
          onChange={(e) => {
            setFilterName(e.target.value);
          }}
          className="border p-2 rounded"
        />
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
          }}
          className="border p-2 rounded"
        >
          <option value="">Tous les types</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value));
          }}
          className="border p-2 rounded"
        >
          {[10, 20, 50, 100].map((val) => (
            <option key={val} value={val}>
              {val} par page
            </option>
          ))}
        </select>
      </div>

      {/* Liste des Pokémon */}
      <div className="p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {pokemons.map((pokemon) => (
          <Link href={`/pokemons/${pokemon.id}`} key={pokemon.id}>
            <div className="border rounded p-4 hover:bg-gray-100 cursor-pointer relative">
              <span className="absolute top-2 right-2 text-xs text-gray-500 font-bold">
                #{pokemon.id}
              </span>
              
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="mb-2 w-20 h-20 mx-auto"
              />
              
              <h2 className="text-lg font-bold text-center">
                {pokemon.name}
              </h2>

              <div className="flex justify-center gap-2 mt-2">
                {pokemon.types.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-5 h-5 mr-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <p className="text-center py-4 text-gray-500">Chargement...</p>
      )}
    </div>
  );
}
