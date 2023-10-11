// @refresh reset
// Qui sopra un pragma, per aggiungere funzionalità a questo singolo file
// In questo caso chiediamo che le modifiche a questo file spazzino via lo stato di questo componente
import { useState } from "react";

const elvenShieldRecipe = {
  leatherStrips: 2,
  ironIngot: 1,
  refinedMoonstone: 5
};

const elvenGauntletsRecipe = {
  ...elvenShieldRecipe,
  leather: 1,
  refinedMoonstone: 4,
};

console.log(elvenShieldRecipe);
console.log(elvenGauntletsRecipe);

const Recipes = () => {
  const [recipe, setRecipe] = useState({});
  return (
    <div>
      <h3>Current Recipe:</h3>
      <button onClick={() => setRecipe(elvenShieldRecipe)}>Elven Shield Recipe</button>
      <button onClick={() => setRecipe(elvenGauntletsRecipe)}>Elven Gauntlets Recipe</button>
      <ul>
        {Object.keys(recipe).map((material) => (
          <li key={material}>
            {material}: {recipe[material]}
          </li>
        ))}
      </ul>
    </div>
  )
};

export default Recipes;