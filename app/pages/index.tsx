import { Router, useRouter } from 'next/router'
import { useEffect } from 'react';

const App = () => {
  const router = useRouter()
  useEffect(() => {
    router.push("/ofertas?modalidade=venda")
  }, [])
  return <div>Você está sendo redirecionado para as ofertas</div>
}

export default App
