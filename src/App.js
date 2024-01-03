import React, {useState} from "react";
import css from './App.css'

export default function Dictionary(){
  const [storeInfo, setStoreInfo] = useState([{}]) //stores data from the api
  const [input, setInput] = useState('') //get the user input for the word they wanna search for
  const [speech, setSpeech] = useState('')
  const [input1, setInput1] = useState([]) //stores the information about the part of speech
  const [diffPartsOfSpeech, setDiffPartsOfSpeech] = useState([]); //for dropdown
  const [invalidWord, setInvalidWord] = useState({});
  
//try catch

  //when the enter key is pressed, the definiton is printed
  const getWord =(event) =>{
    //fetch data from the api when the user presses the enter button
    if(event.key === 'Enter'){
      //need to use $and then {input} so the api knows to search for the user input 
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`).then( //aka chaining in JS
      //parse it to json
      result => result.json()).then(
        //pass it into a variable and print the var
        word =>{ //word is a parameter in this arrow function
          console.log("word", word)
          //console.log("does word exist", word[0])
          if (typeof word[0] === 'undefined') {
            const newInvalidWord = {
              title: 'No Definitions Found',
              message: "Sorry pal, we couldn't find definitions for the word you were looking for.",
              resolution: 'You can try the search again at a later time or head to the web instead.'
            };
            setInvalidWord(newInvalidWord);
          } else {
            setInvalidWord({}); // Set invalidWord to empty when the word is valid
            setStoreInfo(word); // Update with valid word info
            console.log("new word", word);
          }
        }
      ).catch(error => { //catch statement for error handling
      console.error(`Error fetching data: ${error.message}`);
    })
    }
  }

  console.log("this is invalid word", invalidWord); //invalidword is empty
  
  //when the enter key is not pressed anymore, this function is called to clear the input box
  const clear =(event) =>{
    try{
      if(event.key === "Enter"){ //if the key in question is the enter key
        setInput('') //reset the state to an empty string so the box is empty
        setSpeech('') //reset the state to an empty string so the box is empty
        if (speech === ''){
          setInput1([]) //clear the second input box
        }
        
      }
    }
    catch (error){
      console.error("Something bad happened");
      console.error(error);
    }
  }

  
  const getDef = (event) =>{
    if(event.key === 'Enter'){
      //initialize variables
      let { meaning, syn, ant, example } = ''; 
      let a = [];

      for (let j = 0; j < storeInfo.length; j++){ //iterate through the data collected from the api
        for (let i = 0; i < storeInfo[j].meanings.length; i++){ //iterate through all the meanings
          if(speech === storeInfo[j].meanings[i].partOfSpeech){ //if the input is in the api result
            for(let k = 0; k < storeInfo[j].meanings[i].definitions.length; k++){ //store all the definitions associated with the speech
              meaning = storeInfo[j].meanings[i].definitions[k].definition
              example = storeInfo[j].meanings[i].definitions[k].example
              a.push({ speech, meaning, example }); //add everything to the array
            }
            ant = storeInfo[j].meanings[i].antonyms;
            syn = storeInfo[j].meanings[i].synonyms;

            // Check if antonyms and synonyms are arrays before pushing
            if (Array.isArray(ant)) {
              a.push({ antonyms: ant });
            }

            if (Array.isArray(syn)) {
              a.push({ synonyms: syn });
            }
          }
        }
      }
      
      setInput1(a) //store the array
      console.log(a)
      
    }
  }

//has a dropdown menu of the availiable parts of speech
  const dropdown = () => {
    let diffParts = [] //empty array to store the parts of speech
    for (let j = 0; j < storeInfo.length; j++){ //iterate through the api result
      for (let i = 0; i < storeInfo[j].meanings.length; i++){
        const parts = storeInfo[j].meanings[i].partOfSpeech //extracts the partOfSpeech

        if (!diffParts.includes(parts)) { //checks if the array does not already contain the part of speech
          diffParts.push(parts);
      }
      }
    }
    setDiffPartsOfSpeech(diffParts)
    console.log(diffParts)
  }

  //reset the entire interface
  const reset = () => {
    setStoreInfo([{}])
    setInput('')
    setSpeech('')
    setInput1(null)
  }

  const button = <button onClick={reset} className="button">Search for a new word or press this button!</button>

  return(
    
    <div className='container'>
           
      <input className="input" placeholder="Enter a word..." onChange={(e) => setInput(e.target.value)} value={input} onKeyPress={getWord} onKeyUp={clear}/>
      
      {typeof storeInfo[0].word === 'undefined' ? ( //if we havent searched for a word yet or we dont have th data
        <div>
          <p>Welcome to your dictionary! Enter a word and press the enter key to get information about it.</p>

        </div>
      ):
      (
        Object.keys(invalidWord).length !== 0 && invalidWord.constructor === Object ? (
          <>
          <p>{invalidWord.title}</p>
          <p>{invalidWord.message}</p>
          <p>{invalidWord.resolution}</p>
          </>
        ):
      (
        <div className='word-data'>
        <div className='intro'>
        <p className='word'>{storeInfo[0].word}</p>  

        <div>{button}</div>
        </div>
        {storeInfo[0].phonetics && storeInfo[0].phonetics[0] && storeInfo[0].phonetics[0].text !== undefined && storeInfo[0].phonetics[0].text !== null ? (
          <p className="phonetics">{storeInfo[0].phonetics[0].text}</p>
          ): 
          (
          <p></p>
          )}

            <hr />{/*horizontal line*/}

            <p><span className='header'>Definition(s):</span></p>            
            <div>
                <ul>
                  {storeInfo[0].meanings[0].definitions.map((definition, index) => (
                    <li key={index} >{definition.definition}
                    
                    {typeof definition.example === 'undefined' || definition.example === null? 
                    (
                      <p></p>
                    ):
                    (
                      <p><span style={{color:"#528AAE"}}>Example: </span>{definition.example}</p>
                    )}
                    
                    </li>
                    
                  ))}
            </ul>
            </div>
            
            
        <br/>
        <table>
        <tbody>
        <tr>
            <td className='header'>Part of speech</td>
            <td className='header'>Synonym</td>
            <td className='header'>Antonym</td>
        </tr>
        <tr>
          <td><p>{storeInfo[0].meanings[0].partOfSpeech}</p></td>

          <td>
              {typeof storeInfo[0].meanings[0].synonyms[0] === 'undefined' ? 
              (
                <p>No synonyms found</p>
              ):
              (
                storeInfo[0].meanings[0].synonyms.length > 0 
                && (
                <ul style={{ textAlign: "center", listStyleType: "none", padding: 0 }}>

                  {storeInfo[0].meanings[0].synonyms.map((synonym, index) => (
                    <li key={index}>{synonym}</li>
                  ))}
                </ul>
              )
            )
            }
         </td>


          <td>
            {typeof storeInfo[0].meanings[0].antonyms?.[0] === 'undefined' ? (
              <p>No antonyms found</p>
            ) : (
              storeInfo[0].meanings[0].antonyms.length > 0 && (
                <ul style={{ textAlign: "center", listStyleType: "none", paddingLeft:"0px" }}>
                  {storeInfo[0].meanings[0].antonyms.map((antonym, index) => (
                    <li key={index}>{antonym}</li>
                  ))}
                </ul>
              )
            )}
          </td>

        </tr>
      
        </tbody>
        </table>

    

{/*if theres another part od speech
for every one u go thru that doesnt have a syn, flip a boolean value (no syn: boolean value/ counter unchanged)*/}

        <div className="speech">
          Not the definition you were looking for?
          Enter the part of speech of the word to get a more accurate definition
        </div>
        <input className="input" placeholder="Part of speech..." list="partsOfSpeech" onChange={(e) => setSpeech(e.target.value)} value={speech} onKeyPress={getDef} onKeyUp={clear} onClick={dropdown} style={{alignSelf:"center"}}/>
        
        <div className="main">
        <datalist id="partsOfSpeech">
            {diffPartsOfSpeech.map((part, index) => (
              <option key={index} value={part} />
            ))}
          </datalist>

        </div>
        
        <div>

          {input1.length > 0? (
            <>
            <p><span className='header' style={{alignContent:"center"}}>Definition(s):</span></p>
            <ul>
              {input1.map((item, index) => (
                <>
                {typeof item.meaning !== "undefined" && item.meaning !== null ? (
                  <>
                  <li key={index}>{item.meaning}</li>
                  {typeof item.example !== "undefined" && item.example !== null ? (
                  <p><span style={{color:"#528AAE", marginLeft:"0.5cm"}}>Example: </span>{item.example}</p>
                  ):(
                    <p></p>
                  )}
                  </>
                ):(
                  <p></p>
                )}
                
                
                
                </>
              ))}
            </ul>
            

            </>

                  
          ):(
            <p>Please choose an option from the dropdown menu</p>
          )}
        <br/>
        </div>
        {input1.length > 0? (
        <table>
            <tbody>
            <tr>
                <td className='header'>Part of speech</td>
                <td className='header'>Synonym</td>
                <td className='header'>Antonym</td>
            </tr>
            <tr>
              {input1.length > 0 ? (
                <td>
                <p>{input1[0].speech}</p>
                </td>
              ):(
                <p></p>
              )}

            <td>
            {input1.map((item, index) => (
            <React.Fragment key={index}>
              {item.synonyms && item.synonyms.length > 0 ? (
                <ul style={{ textAlign: "center", listStyleType: "none", padding: 0 }}>
                  {item.synonyms.map((syn, synIndex) => (
                    <li key={synIndex}>{syn}</li>
                  ))}
                </ul>
              ) : (
                item.synonyms && item.synonyms.length === 0 ? (
                  <p>No synonyms found</p>
                ) : (
                  <p></p>
                )
              )}
            </React.Fragment>
          ))}


            </td>

            <td>
            {input1.map((item, index) => (
            <React.Fragment key={index}>
              {item.antonyms && item.antonyms.length > 0 ? (
                <ul style={{ textAlign: "center", listStyleType: "none", padding: 0 }}>
                  {item.antonyms.map((ant, antIndex) => (
                    <li key={antIndex}>{ant}</li>
                  ))}
                </ul>
              ) : (
                item.antonyms && item.antonyms.length === 0 ? (
                  <p>No antonyms found</p>
                ) : null
              )}
            </React.Fragment>
          ))}

            </td>
            </tr>
            </tbody>
        </table>
        ):null}

        </div> 
      )
      )
      }
       
    </div>
  );
}