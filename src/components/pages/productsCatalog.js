import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"


function ProductsCatalog(){
    const firebaseConfig = {
        apiKey: "AIzaSyD6txBIF18GfL7EvXyouaADDFqK9rJd6cA",
        authDomain: "cashless-appdoc.firebaseapp.com",
        projectId: "cashless-appdoc",
        storageBucket: "cashless-appdoc.appspot.com",
        messagingSenderId: "3827619937",
        appId: "1:3827619937:web:4b0bedbaa556b077897220",
        measurementId: "G-9Y22LJCR68"
    };
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore();
    const collectionRef = "categories";
    const colRef = collection(db, collectionRef);

    const productCollection = "products_catalog";
    const product_colRef = collection(db, productCollection);

    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("")
    const [productSubCategory, setProductSubCategory] = useState("")
    const [productCatalogList, setProductCatalogList] = useState([])

    const [categories, setCategories] = useState([]);
    const [categoriesOptions, setCategoriesOptions] = useState([])
    const [subCategoriesOptions, setSubCategoriesOptions] = useState([])

    /* #################################### */
    /* OBTER CATEGORIAS */
    /* #################################### */
    function getCategories(){
        categories.length = []; 
        const queryList = query(colRef, orderBy('Name', 'asc')) 
        getDocs(queryList).then( (snapshot) => {              
            snapshot.docs.forEach((doc) => {
                categories.push({ ...doc.data(), id: doc.id})
            })
            setCategoriesOptions(
                categories.map((key, i) => (
                    <option key={i}>
                        {key.Name}
                    </option>
                ))
            );
        }).catch( (err) => {
            console.log("err")
        });
    }
    /* #################################### */
    /* OBTER ATUALIZAR SUBCATEGORIAS */
    /* #################################### */
    function updateChildsOptions(value){
        setProductCategory(value)
        categories.map( (key, index) => {
            if(key.Name === value){
                if(key.Childs.length > 0){
                    setSubCategoriesOptions(
                        key.Childs.map( (subKeys, i) => (
                            <option key={i}>
                                {subKeys}
                            </option>
                        ))
                    )
                } else {
                    setSubCategoriesOptions([])
                }
            }
        })
    }

    /* #################################### */
    /* Adicionar produto ao catálogo */
    /* #################################### */
    function AddProductToCatalog(){
        addDoc(product_colRef, {
            Name: productName,
            category: productCategory,
            categoryChild: productSubCategory,
            CreatedAt: serverTimestamp()
        }).then(() => {
            listProducCatalog();
            console.log("New product added")
        }).catch( err => console.log(err))
    }

    /* #################################### */
    /* Listar Categorias */
    /* #################################### */
    function listProducCatalog(){
        let productList = []
        const queryList = query(product_colRef, orderBy('Name', 'asc')) 
        getDocs(queryList).then( (snapshot) => {              
            snapshot.docs.forEach((doc) => {
                productList.push({ ...doc.data(), id: doc.id})
            })
            setProductCatalogList(
                productList.map((key, i) => (
                    <li key={i}>
                        {key.Name}
                        {key.category}
                        {key.categoryChild}
                        {Date(key.CreatedAt)}
                        <i onClick={ () => { deletProduct(key.id) }}>X</i>
                    </li>
                ))
            )
        });
    }

    function deletProduct(id){
        const docRef = doc(db, productCollection, id);
        deleteDoc(docRef)
            .then( () => {
                console.log("deleted");
                listProducCatalog();
            }).catch( (err) => console.log(err))
    }

    useEffect(() => {
        getCategories();
        listProducCatalog();
    }, [])

    return(
        <>
            <>
                {productName} / {productCategory} / {productSubCategory}
            </>
            <div className="addProductForm">
                <input type="text" onChange={(event) => { setProductName(event.target.value) } } />
                <select onChange={(event) => { updateChildsOptions(event.target.value) } }>
                    <option> </option>
                    {categoriesOptions}
                </select>
                <select onChange={(event) => { setProductSubCategory(event.target.value) } }>
                    <option>subCategories</option>
                    {subCategoriesOptions}
                </select>
                <button onClick={AddProductToCatalog}>Add</button>
            </div>

            <h2>Products Catalog</h2>
            <ul>
                {productCatalogList}
            </ul>
        </>
    )
}

export default ProductsCatalog;