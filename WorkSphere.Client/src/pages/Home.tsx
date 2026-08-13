import React from 'react';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <main style={{padding: '1rem'}}>
      <Header />
      <section>
        <h2>Welcome</h2>
        <p>This is the WorkSphere client skeleton. Use pages/, components/, and layouts/ to organize features.</p>
      </section>
    </main>
  );
};

export default Home;
