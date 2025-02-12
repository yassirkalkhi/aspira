import { algoliasearch } from 'algoliasearch';
import React, { useEffect, useRef, useState } from 'react';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, configure, index } from 'instantsearch.js/es/widgets';
import { Search } from 'lucide-react';

const searchClient = algoliasearch('A4L8O9LLGY', '0dc5543b7404eb77bc692b36f9c921b4');

const Algolia = () => {
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!searchRef.current) return;

    const search = instantsearch({
      indexName: 'users',
      searchClient,
    });

    search.addWidgets([
      searchBox({
        container: '#searchbox',
        placeholder: 'Search...',
        showReset: false,
        showSubmit: false,
        cssClasses: {
          root: 'w-full',
          form: 'w-full',
          input: 'flex items-center w-full px-4 py-2 pl-10 rounded-lg bg-dark-secondary text-gray-200 focus:outline-none pt-3',
        },
        queryHook: (q, refine) => {
          setQuery(q);
          refine(q);
        },
      }),

      // Users Index
      index({ indexName: 'users' }).addWidgets([
        configure({ hitsPerPage: 3 }),
        hits({
          container: '#hits-users',
          templates: {
            item: (hit) => `
              <div class="p-3 bg-dark-primary border-b border-gray-700 hover:bg-dark-secondary cursor-pointer flex items-center">
                <a href='/${hit.username}'>
                <div class="w-10 h-10 rounded-full mr-3 bg-center bg-cover" style="background-image: url('${hit.avatar}')"></div>
                <div>
                  <p class="font-semibold text-white">${hit.firstname}</p>
                  <p class="text-sm text-white/60">${hit.email}</p>
                   </a>
                </div>
              </div>
            `,
          },
        }),
      ]),

      // Posts Index
      index({ indexName: 'posts' }).addWidgets([
        configure({ hitsPerPage: 5 }),
        hits({
          container: '#hits-posts',
          templates: {
            item: (hit) => `
              <div class="p-3 bg-dark-primary border-b border-gray-700 hover:bg-dark-secondary cursor-pointer">
                <a href='/${hit.author}'>
                  <p class="font-semibold text-white">${hit.author}</p>
                  <p class="text-sm text-white/60 line-clamp-2">${hit.content}</p>
                  <div class="w-10 h-10  mr-3 bg-center bg-cover" style="background-image: url('${hit.image}')"></div>
                </a>
              </div>
            `,
          },
        }),
      ]),

   
    ]);

    search.start();
    return () => search.dispose();
  }, []);

  return (
    <div className="relative w-full max-w-[300px]">
      <div ref={searchRef}>
        <div id="searchbox" className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <div className={`absolute  -left-20 sm:left-0 top-14 mt-2 w-screen sm:w-full  rounded-lg shadow-xl z-50 overflow-hidden ${!query ? 'hidden' : ''}`}>
          <div className="bg-dark-primary p-2">
            <h3 className="text-white/80 text-sm font-semibold px-3 py-2">Users</h3>
            <div id="hits-users"></div>
          </div>

          <div className="bg-dark-primary p-2 border-t border-gray-700">
            <h3 className="text-white/80 text-sm font-semibold px-3 py-2">Posts</h3>
            <div id="hits-posts"></div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Algolia;