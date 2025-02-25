import {ToastId, useToast} from '@chakra-ui/react';
import {debounce, throttle} from 'lodash';
import React from 'react';
import {FieldValues} from 'react-hook-form';
import {ReactElement, cloneElement} from 'react';
import {UseFormHandleSubmit, SubmitHandler} from 'react-hook-form';

export interface ToastMessage {
	title: string;
	description?: string;
}

export interface ToastMessages {
	success: ToastMessage;
	error: ToastMessage;
	loading: ToastMessage;
}

interface PromiseBasedToastProps {
	promise: () => Promise<any>;
	toastMessages?: ToastMessages;
	children: ReactElement;
}

export const CustomToast = () => {
    const toast = useToast();
    // types are: "success", "info", "warning", "error"

    const addToast = () => {
        toast({
            position: 'top-right',
            id: 'promise-toast',
            duration: 3000,
            isClosable: true,
        })
    }

    return { addToast };
}

export const usePromiseToast = () => {
	const toast = useToast({
		position: 'top-right',
		id: 'promise-toast',
		duration: 5000,
		isClosable: true,
	});

	const showPromiseToast = <T,>(
		promise: () => Promise<T>,
		messages: ToastMessages
	) => {
        toast.closeAll();
		if (!toast.isActive('promise-toast')) {
			const toastPromise = promise()
				.then((response) => response)
				.catch(async (error) => {
					let errorMessage = 'An unexpected error occurred';

					if (
						error.response &&
						error.response.data &&
						error.response.data.message
					) {
						errorMessage = error.response.data.message;
					} else if (error.message) {
						errorMessage = error.message;
					}

					throw new Error(errorMessage);
				});

			toast.promise(toastPromise, {
				success: messages.success,
				error: (error) => ({
					title: messages.error.title,
					description: error.message,
				}),
				loading: messages.loading,
			});
		}
	};
	// Adjust the debounce time as needed

	return {showPromiseToast};
};

const defaultToastMessages: ToastMessages = {
	success: {
		title: 'Success',
		description: 'Operation completed successfully',
	},
	error: {title: 'Error', description: 'Operation failed'},
	loading: {title: 'Loading', description: 'Operation in progress'},
};



interface UseSubmitWithToastProps<T extends FieldValues> {
	handleSubmit: UseFormHandleSubmit<T>;
	onSubmit: SubmitHandler<T>;
	toastMessages: ToastMessages;
}

export const usePromiseBasedToast = <T extends FieldValues>({
	handleSubmit,
	onSubmit,
	toastMessages,
}: UseSubmitWithToastProps<T>) => {
	const {showPromiseToast} = usePromiseToast();

	const wrappedSubmit = handleSubmit(async (data: T) => {
		await showPromiseToast(
			async () => onSubmit(data),
			toastMessages ?? defaultToastMessages
		);
	});

	return {wrappedSubmit};
};

export default usePromiseBasedToast;
