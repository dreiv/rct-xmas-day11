import React from 'react'
import ReactDOM from 'react-dom'
import { unstable_createResource as createResource } from 'react-cache'

let PokemonCollectionResource = createResource(() =>
  fetch('https://pokeapi.co/api/v2/pokemon/').then(res => res.json())
)

function PokemonListItem({ className, component: Component = 'li', ...props }) {
  return (
    <Component
      className={['pokemon-list-item', className].join(' ')}
      {...props}
    />
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback
      ) : (
        <div>Something went wrong</div>
      )
    }

    return this.props.children
  }
}

function PokemonList({ renderItem }) {
  return (
    <ul>
      {PokemonCollectionResource.read().results.map(pokemon =>
        renderItem(pokemon)
      )}
    </ul>
  )
}

function App() {
  let [selectedPokemonId, setSelectedPokemonId] = React.useState(1)

  return (
    <div>
      <h1>
        <span role="img" aria-label="React Holiday Eleven">
          ⚛️🎄✌️
        </span>
        : Day 11
      </h1>
      <strong>selected pokemon id: {selectedPokemonId}</strong>
      <ErrorBoundary>
        <React.Suspense fallback={<div>...loading</div>}>
          <PokemonList
            renderItem={pokemon => (
              <PokemonListItem
                onClick={() => setSelectedPokemonId(pokemon.url.split('/')[6])}
                key={pokemon.name}
              >
                {pokemon.name}
              </PokemonListItem>
            )}
          />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
