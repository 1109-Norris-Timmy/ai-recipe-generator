import { useState } from "react";
import type { FormEvent } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
Amplify.configure(outputs);
const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});
function App() {
  console.log("App component rendering...");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // Add a simple test to see if the component is working
  console.log("App state:", { result, loading });
 const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 setLoading(true);
 setResult(""); // Clear previous result
 try {
 const formData = new FormData(event.currentTarget);
 const ingredients = formData.get("ingredients")?.toString() || "";
 console.log("Submitting ingredients:", ingredients);
 
 const { data, errors } = await amplifyClient.queries.askBedrock({
 ingredients: [ingredients],
 });
 
 console.log("API Response:", { data, errors });
 
 if (errors && errors.length > 0) {
 console.error("API Errors:", errors);
 setResult(`Error: ${JSON.stringify(errors)}`);
 } else if (data) {
 console.log("Recipe data received:", data);
 setResult(data.body || "No recipe content returned");
 } else {
 setResult("No data returned from API");
 }
 } catch (e) {
 console.error("Exception occurred:", e);
 setResult(`An error occurred: ${e}`);
 } finally {
 setLoading(false);
 }
 };
 return (
 <div className="app-container">
 <div className="header-container">
 <h1 className="main-header">
 Meet Your Personal
 <br />
 <span className="highlight">Recipe AI</span>
 </h1>
 <p className="description">
 Simply type a few ingredients using the format ingredient1,
 ingredient2, etc., and Recipe AI will generate an all-new
recipe on
 demand...
 </p>
 </div>
 <form onSubmit={onSubmit} className="form-container">
 <div className="search-container">
 <input
 type="text"
 className="wide-input"
 id="ingredients"
 name="ingredients"
 placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
 />
 <button type="submit" className="search-button">
 Generate
 </button>
 </div>
 </form>
 <div className="result-container">
 {loading ? (
 <div className="loader-container">
 <p>Loading...</p>
 <Loader size="large" />
 <Placeholder size="large" />
 <Placeholder size="large" />
 <Placeholder size="large" />
 </div>
 ) : (
 result && (
 <div className="result">
 <h3>Generated Recipe:</h3>
 <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{result}</pre>
 </div>
 )
 )}
 </div>
 </div>
 );
}
export default App;