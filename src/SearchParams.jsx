import { useContext,useDeferredValue, useMemo, useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import Results from "./Results";
import AdoptedPetContext from "./AdoptedPetContext";
import useBreedList from "./useBreedList";
import fetchSearch from "./fetchSearch";
const ANIMALS = ["bird", "cat", "dog", "rabbit", "reptile"];

const SearchParams = () => {
  const [requestParams, setRequestParams] = useState({
    location: "",
    animal: "",
    breed: "",
  });
  const [adoptedPet] = useContext(AdoptedPetContext);
  const [animal, setAnimal] = useState("");
  const [breeds] = useBreedList(animal);
  const [isPending, startTransition] = useTransition()

  const results = useQuery(["search", requestParams], fetchSearch);
  const pets = results?.data?.pets ?? [];

  /** 
   * useDeferredValue example
   * 
   * The useDeferredValue hook is used to defer the value of pets to the next render.
   * In should be used to low priorty updates, like search results, that can be deferred to the next render.
   * In this case has no effect on the user experience, but it can be used to improve performance.
   * This is only an usage example.
   * **/

  const deferredPets = useDeferredValue(pets)
  const renderedPets = useMemo(() => <Results pets={deferredPets}/>, [deferredPets])

  /** End of useDeferredValue example**/

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const obj = {
            animal: formData.get("animal") ?? "",
            breed: formData.get("breed") ?? "",
            location: formData.get("location") ?? "",
          };
          // Step 1 of the transition
          startTransition(() => {
            // Whatever happens inside of starTransition, low priority stuff can be interrupted
            setRequestParams(obj);
          })
        }}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
          </div>
        ) : null}
        <label htmlFor="location">
          Location
          <input id="location" name="location" placeholder="Location" />
        </label>

        <label htmlFor="animal">
          Animal
          <select
            id="animal"
            name="animal"
            onChange={(e) => {
              setAnimal(e.target.value);
            }}
            onBlur={(e) => {
              setAnimal(e.target.value);
            }}
          >
            <option />
            {ANIMALS.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="breed">
          Breed
          <select disabled={!breeds.length} id="breed" name="breed">
            <option />
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>
        {/**  Step 2 of the transition */}
        {
          isPending ? (
            <div className="mini loading-pane">
              <h2 className="loader">😺</h2>
            </div>
          ) : <button>Submit</button>
        } 
        
      </form>
      {/** This is only for the useDeferred value example, Results component should not be deferred **/}
      {renderedPets}
      {/* <Results pets={pets} /> */}
    </div>
  );
};

export default SearchParams;
