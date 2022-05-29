import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    }
})

type Props = {
    children?: React.ReactNode
};

const AppQueryProvider: React.FC<Props> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default AppQueryProvider
