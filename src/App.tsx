import React, { useEffect } from 'react';
import './App.scss';
import { Country, AppState, AppIO } from './App.io';
import { connect } from 'react-redux';

type AppProps = {
  io: AppIO,
  countries: Country[]
}

function App({ countries, io }: AppProps) {
  useEffect(() => { io.getCountries(); }, [io]);

  return (
    <div className="App">
        {
          (countries ?? []).map((c: Country) => {
            return <div key={c.id}>{ c.name }</div>;
          })
        }
    </div>
  );
}

export default connect((st: AppState) => ({
    countries: (st ?? []).countries
  })
)(App);
