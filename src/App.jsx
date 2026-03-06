import { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";
import { ALL_SAREES } from "./data/sarees.js";

async function fetchSareesFromAPI(page) {
  const start = (page - 1) * 10;
  return ALL_SAREES.slice(page > 1 ? start - 2 : start, start + 10);
}

export default function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const seenIds = useRef(new Set());
  const loadedPages = useRef(new Set());

  const loadPage = useCallback(async (pageNum) => {
    if (loadedPages.current.has(pageNum)) return;
    loadedPages.current.add(pageNum);

    setLoading(true);
    try {
      const raw = await fetchSareesFromAPI(pageNum);
      const newItems = raw.filter((s) => !seenIds.current.has(s.id));
      newItems.forEach((s) => seenIds.current.add(s.id));
      if (raw.length === 0) setHasMore(false);
      setItems((prev) => [...prev, ...newItems]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  return (
    <div className="container">
      <input type="checkbox" id="menu-toggle" />

      <div className="header">
        <div className="header-left">
          <label className="menu-icon" htmlFor="menu-toggle">
            <i className="fa-solid fa-bars" style={{ color: "#750350" }}></i>
          </label>
          <h1>
            MRaniCollections <i className="fa-solid fa-crown"></i>
          </h1>
          <input
            className="search-area"
            type="text"
            placeholder="🔍 Search by Saree Code/Name"
          />
        </div>
        <div className="header-right">
          <a href="#">
            <i className="fa-regular fa-user"></i> Profile
          </a>
          <a href="#">
            <i className="fa-solid fa-cart-arrow-down"></i> Cart
          </a>
        </div>
      </div>

      <div className="navigation">
        <h2>Sarees For You</h2>
        <div className="dropdown">
          <label style={{ opacity: 0.6 }}>Sort by: </label>
          <select>
            <option>New Arrivals</option>
            <option>Price (High to Low)</option>
            <option>Price (Low to High)</option>
            <option>Ratings</option>
          </select>
        </div>
        <div className="category">
          <h3 style={{ borderBottom: "2px solid rgb(240,238,238)" }}>
            Category ↓
          </h3>
          <div className="category-list">
            <div>
              <input type="checkbox" />
              <label>Silk Sarees</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Poonam Sarees</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Banarasi Sarees</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Kanchipuram Sarees</label>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        {items.map((saree) => (
          <div className="item" key={saree.id}>
            <img src={saree.image} alt={saree.name} />
            <span className="saree-code">{saree.code}</span>
            <p>{saree.name}</p>
            <p>₹{saree.price.toLocaleString("en-IN")}</p>
            <a href="#">View Details →</a>
          </div>
        ))}

        <div className="load-more-row">
          {loading && (
            <div className="spinner-wrap">
              <div className="spinner"></div>
              <span>Loading sarees…</span>
            </div>
          )}
          {!loading && hasMore && (
            <button
              className="load-more-btn"
              onClick={() => {
                const next = page + 1;
                setPage(next);
                loadPage(next);
              }}
            >
              Load More Sarees...
            </button>
          )}
          {!loading && !hasMore && (
            <p className="end-msg">✨ You've seen all {items.length} sarees!</p>
          )}
        </div>
      </div>

      <div className="footer">
        <div className="footer-social-media">
          <h6>Social:</h6>
          <div className="social-media-icons">
            <a href="#">
              <i
                className="fa-brands fa-facebook-f"
                style={{ color: "white" }}
              ></i>
            </a>
            <a href="#">
              <i
                className="fa-brands fa-whatsapp"
                style={{ color: "white" }}
              ></i>
            </a>
            <a href="#">
              <i
                className="fa-brands fa-instagram"
                style={{ color: "white" }}
              ></i>
            </a>
            <a href="#">
              <i
                className="fa-brands fa-youtube"
                style={{ color: "white" }}
              ></i>
            </a>
          </div>
        </div>
        <div className="footer-registered-add">
          <h6>Office Address:</h6>
          <p style={{ paddingTop: 10, fontSize: 11 }}>
            Sion Koliwada, Mumbai-400037
            <br />
            Maharashtra, India
            <br />
            Contact: 7045065028
          </p>
        </div>
      </div>
    </div>
  );
}
