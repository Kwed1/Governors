import axios from 'axios'
export interface InvoiceResponse {
	invoice_link: string
}

const useInvoiceApi = () => {
	const host = "https://adminapi.devmainops.store"
	const getInvoiceAddress = async (amount:number) => {
		try {
			const response = await axios.post<InvoiceResponse>(`${host}/donate`, {
				description: 'Donation for charity',
				amount: amount,
			});
			return response.data?.invoice_link;
		} catch (error) {
			console.error('Error fetching invoice address:', error);
		}
	};
	

	return {getInvoiceAddress}
}
export default useInvoiceApi