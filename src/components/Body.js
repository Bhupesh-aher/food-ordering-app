import Restaurantcard, { withPromotedLabel } from "./Restaurantcard";
import {useContext, useEffect, useState} from "react";
import resList from "../utils/mockData";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import UserContext from "../utils/UserContext";


  
const Body = () =>{

  //Local State Variable - Super poweful variable
  const [ListOfRestaurants, SetListOfRestaurants] = useState([]);
  const [filtredRestaurant, SetfiltredRestaurant] = useState([]);

  const[searchText, setSearchText] = useState(""); 
  const RestaurantcardPromoted = withPromotedLabel(Restaurantcard);

  useEffect(() => {
    fetchData();
  }, [])
  
  const fetchData = async () => {
    const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9715987&lng=77.5945627&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");

    const json = await data.json();

    console.log(json);
    

    

    //optional chaining 
    SetListOfRestaurants(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants) 

    SetfiltredRestaurant(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants) 
  }

  // console.log(ListOfRestaurants);

  const onlineStatus = useOnlineStatus();
  if(onlineStatus === false) return <h1>Looks like you're offline!!! please check your internet connection</h1>

  const{loggedInUser, setUserName} = useContext(UserContext);

  if(ListOfRestaurants.length === 0) return <Shimmer/>;
  
  //conditional Rendring -  
  
    return  (
       <div className="body">
            <div className="filter flex">
              <div className="search m-4 p-4">
                <input type="text" className="border border-solid border-black" value={searchText}
                onChange={(e) => {setSearchText(e.target.value)}}/>
                
                <button className="px-4 py-2 bg-green-100 m-4 rounded-lg" onClick={() =>{

                  const filtredRestaurant =  ListOfRestaurants.filter((res) => res.info.name.toLowerCase().includes(searchText.toLowerCase()));
                  SetfiltredRestaurant(filtredRestaurant);

                }} >search</button>
                  
              </div>
              <div className="search m-4 p-4 flex items-center">
                <button className="px-4 py-2 bg-gray-100 rounded-lg"  onClick={() => {
                    filtedList = ListOfRestaurants.filter(res => res.info.avgRating > 4);
                    SetListOfRestaurants(filtedList);
                  }}>
                      Restaurant Filter
                  </button>
              </div>

              <div className="search m-4 p-4 flex items-center">
                <label >UserName </label>
                <input className="border border-black p-2" value={loggedInUser} onChange={(e) => setUserName(e.target.value)}/>
              </div>
                
            </div>
            <div className="flex flex-wrap"> 
             {
              filtredRestaurant.map((eachRestro) => (
                 <Link key = {eachRestro.info.id} to={"/restaurants/"+eachRestro.info.id}>

                  {eachRestro.info.promoted ? (<RestaurantcardPromoted resData = {eachRestro}/> ): (<Restaurantcard  resData = {eachRestro} />  
                 ) }
                  </Link>)
             )}
             </div>
  
       </div>   
    )
  };

export default Body;