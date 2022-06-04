import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Dogs from './components/Dog/Dogs';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import Lounge from './components/Lounge';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import DogAdd from './components/Dog/DogAdd';
import DogDetail from './components/Dog/DogDetail';
import DogEdit from './components/Dog/DogEdit';
import DogDelete from './components/Dog/DogDelete';
import Cats from './components/Cat/Cats';
import CatAdd from './components/Cat/CatAdd';
import CatDetail from './components/Cat/CatDetail';
import CatEdit from './components/Cat/CatEdit';
import CatDelete from './components/Cat/CatDelete';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {
  const [dogs, setDogs] = useState([]);
  const [cats, setCats] = useState([]);
  const [urlDog, setUrlDog] = useState('/dogs/?limit=3&offset=0');
  const [urlCat, setUrlCat] = useState('/cats/?limit=3&offset=0');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const getDogs = async (urlDog, options) => {
    setUrlDog(urlDog);
    try {
        const response = await axiosPrivate.get(urlDog, options);
        console.log(response.data);
        setDogs(response.data);
    } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
    }
  }

  const getCats = async (urlCat, options) => {
    setUrlCat(urlCat);
    try {
        const response = await axiosPrivate.get(urlCat, options);
        console.log(response.data);
        setCats(response.data);
    } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    getDogs(urlDog, {
        signal: controller.signal
    });

    getCats(urlCat, {
      signal: controller.signal
    })
    return () => {
        controller.abort();
    }
  }, []);

  const dogAddHandler = async (dog) => {
    console.log('DOG: ', dog);
    const response = await axiosPrivate.post('dogs/', JSON.stringify(dog));
    console.log(response.data);
    getDogs(urlDog);
  }

  const dogUpdateHandler = async (dog) => {
    console.log('DOG: ', dog);
    const response = await axiosPrivate.put('dogs/', JSON.stringify(dog));
    console.log(response.data);
    getDogs(urlDog);
  }

  const dogDeleteHandler = async (dog) => {
    console.log('Dog: ', dog);
    const response = await axiosPrivate.delete(`dogs/${dog.id}`);
    console.log(response.data);
    getDogs(urlDog);
  }

  const catAddHandler = async (cat) => {
    console.log('CAT: ', cat);
    const response = await axiosPrivate.post('cats/', JSON.stringify(cat));
    console.log(response.data);
    getCats(urlCat);
  }

  const catUpdateHandler = async (cat) => {
    console.log('CAT: ', cat);
    const response = await axiosPrivate.put('cats/', JSON.stringify(cat));
    console.log(response.data);
    getCats(urlCat);
  }

  const catDeleteHandler = async (cat) => {
    console.log('Cat: ', cat);
    const response = await axiosPrivate.delete(`cats/${cat.id}`);
    console.log(response.data);
    getCats(urlCat);
  }

  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path="dogs" element={<Dogs dogs={dogs} getDogs={getDogs}/>} />
          <Route path="dogs/create" element={<DogAdd addHandler={dogAddHandler}/>} />
          <Route path="dogs/view/:id" element={<DogDetail />} />
          <Route path="dogs/edit/:id" element={<DogEdit updateHandler={dogUpdateHandler}/>} />
          <Route path="dogs/delete/:id" element={<DogDelete deleteHandler={dogDeleteHandler}/>} />

          <Route path="cats" element={<Cats cats={cats} getCats={getCats}/>} />
          <Route path="cats/create" element={<CatAdd addHandler={catAddHandler}/>} />
          <Route path="cats/view/:id" element={<CatDetail />} />
          <Route path="cats/edit/:id" element={<CatEdit updateHandler={catUpdateHandler}/>} />
          <Route path="cats/delete/:id" element={<CatDelete deleteHandler={catDeleteHandler}/>} />
        </Route>


        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
          <Route path="lounge" element={<Lounge />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;