const {
    nanoid
} = require("nanoid");

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    // User tidak menambahkan judul buku pada body request
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi judul buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount == readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updateAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updateAt
    }

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
}

const getAllBooksHandler = (request, h) => {
    const {
        name,
        reading,
        finished
    } = request.query;

    if (name === undefined && reading === undefined && finished === undefined) {
        const response = h
            .response({
                status: 'success',
                data: {
                    books: books.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
        return response;
    }
    if (reading !== undefined) {
        const filteredBooksReading = books.filter((book) => book.reading === !!Number(reading));

        const response = h
            .response({
                status: 'success',
                data: {
                    books: filteredBooksReading.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
        return response;
    }

    const filteredBooksFinished = books.filter((book) => Number(book.finished) === Number(finished), );

    const response = h
        .response({
            status: 'success',
            data: {
                books: filteredBooksFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        .code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        })
        response.code(200);
        return response;
    }
    const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        })
        .code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    const updateAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal diperbarui. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal diperbarui. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage;

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updateAt,
        };
        const response = h.response({
            status: 'success',
            message: 'buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h
        .response({
            status: 'fail',
            message: 'gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

const deleteBookByidHandler = (request, h) => {
    const {
        id
    } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByidHandler,
};