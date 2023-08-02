import * as yup from 'yup';


export const schemaNote = yup.object().shape({
    name: yup
        .string()
        .required('The name must be a string and non-empty')
        .min(1, 'Min length 5 characters')
        .max(50, 'Max length 50 characters'),
    category: yup
        .string()
        .oneOf(
            ['Quote', 'Idea', 'Task', 'Random Thought'],
            "The value must be one of this array: ['Quote', 'Idea', 'Task', 'Random Thought']"
        )
        .required('Category value is missing'),
    content: yup
        .string()
        .required('Content value is missing')
        .min(5, 'Min length 5 characters')
        .max(200, 'Max length 200 characters'),
    archived: yup.boolean().required('The value must be a boolean').default(false),
});

export const schemaParams = yup.object().shape({
    id: yup
        .string()
        .required('The value must be a string and non-empty')
        .test('valid-uuid-or-numeric', 'The value must be a valid UUID or a numeric string', (value) => {
            if (!value) {
                return true;
            }
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
                return true;
            }
            return /^\d+$/.test(value);
        }),
});
