import { ActionFunction, redirect } from 'remix';
import { validationError } from 'remix-validated-form';
import { updateColorById, updateColorByIdFormValidator } from '~/models/color.server';

export const action: ActionFunction = async({ params, request }) => {
    const formData = await request.formData();

    const { data, error } = await updateColorByIdFormValidator.validate(formData);

    if (error) {
        return validationError(error);
    }

    const updatedColor = await updateColorById(data);

    return redirect(`/${params.slug}/edit/${updatedColor.block.index}`);
};
