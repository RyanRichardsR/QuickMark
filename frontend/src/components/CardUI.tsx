
import React, { useState } from 'react';
import { SERVER_BASE_URL } from "../config";


function CardUI() {
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let userId : string = ud.id;
    // let firstName : string = ud.firstName;
    // let lastName : string = ud.lastName;
    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [cardList,setCardList] = useState('');
    const [search,setSearchValue] = React.useState('');
    const [card,setCardNameValue] = React.useState('');
    
    

    async function addCard(e:any) : Promise<void>
    {
	    e.preventDefault();

        let obj = {userId:userId,card:card};
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(`http://cop4331.xyz/api/addcard`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Card has been added');
            }
        }
        catch(error:any)
        {
            setMessage(error.toString());
        }
    };

    async function searchCard(e:any) : Promise<void>
    {
        e.preventDefault();
        
        let obj = {userId:userId,search:search};
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch(`http://cop4331.xyz/api/searchcards`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);
            let _results = res.results;
            let resultText = '';
            for( let i=0; i<_results.length; i++ )
            {
                resultText += _results[i];
                if( i < _results.length - 1 )
                {
                    resultText += ', ';
                }
            }
            setResults('Card(s) have been retrieved');
            setCardList(resultText);
        }
        catch(error:any)
        {
            alert(error.toString());
            setResults(error.toString());
        }
    };



  function handleSearchTextChange( e: any ) : void
    {
        setSearchValue( e.target.value );
    }

    function handleCardTextChange( e: any ) : void
    {
        setCardNameValue( e.target.value );
    }

  return (
    <div id="cardUIDiv">
    <br />
    Search: <input type="text" id="searchText" placeholder="Card To Search For" 
      onChange={handleSearchTextChange} />
    <button type="button" id="searchCardButton" className="buttons" 
      onClick={searchCard}> Search Card</button><br />
    <span id="cardSearchResult">{searchResults}</span>
    <p id="cardList">{cardList}</p><br /><br />
    Add: <input type="text" id="cardText" placeholder="Card To Add" 
      onChange={handleCardTextChange} />
    <button type="button" id="addCardButton" className="buttons" 
      onClick={addCard}> Add Card </button><br />
    <span id="cardAddResult">{message}</span>
  </div>
  );  
}
export default CardUI;
