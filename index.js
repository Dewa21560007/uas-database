const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

const multer = require('multer')
const path = require('path')
const cors = require('cors')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"))
app.use(cors({
    origin:'*'
}))

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});








/* API UNTUK DATA ANGGOTA */

app.post('/api/anggota',upload.single('foto'),(req, res) => {
    const data = { ...req.body };
    const id = Math.floor(Math.random() * 9999);
    const nama = req.body.nama;
    const email = req.body.email;
    const password = req.body.password;
    const foto = req.body.foto;
    const nowa = req.body.nowa;

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO anggota (id,nama,email,password,nowa) values (?,?,?,?,?);';
         
        koneksi.query(querySql,[ id,nama, email,password,nowa], (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename;
        const foto =   imgsrc;
        const data = { ...req.body };
        const querySql = 'INSERT INTO anggota (id,nama,email,password,foto,nowa) values (?,?,?,?,?,?);';
 
        koneksi.query(querySql,[ id,nama, email,password,foto,nowa], (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    }
});

app.get('/api/anggota', (req, res) => {
    const querySql = 'SELECT * FROM anggota';
    
    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
        res.status(200).json({ success: true, data: rows });
    });
});

app.put('/api/anggota/:email', (req, res) => {
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM anggota WHERE email = ?';
    const email = req.body.email;
    const password = req.body.password;
    
    koneksi.query(querySearch, req.params.email, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
    
        if (rows.length) {
            res.status(200).json({ success: true, data: rows });
        } else {
            return res.status(404).json({ message: 'Ada kesalahan', error: err });
        }
    });
});

app.put('/api/anggotaUbah/:id', (req, res) => {
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM anggota WHERE id = ?';
    const id = req.body.id;
    const nama = req.body.nama;
    const email = req.body.email;
    const password = req.body.password;
    const nowa = req.body.nowa;
    
    const queryUpdate = 'UPDATE anggota SET nama=?,email=?,password=?,nowa=? WHERE id = ?';

    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
    
        if (rows.length) {
            koneksi.query(queryUpdate, [nama,email,password,nowa, req.params.id], (err, rows, field) => {
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

app.delete('/api/anggota/:id', (req, res) => {
    const querySearch = 'SELECT * FROM anggota WHERE id = ?';
    const queryDelete = 'DELETE FROM anggota WHERE id = ?';

    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        if (rows.length) {
            koneksi.query(queryDelete, req.params.id, (err, rows, field) => {
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});







/* API UNTUK ARTIKEL */

app.post('/api/materi',upload.single('cover'),(req, res) => {
    const data = { ...req.body };
    const id = Math.floor(Math.random() * 9999);
    const nama = req.body.nama;
    const judul = req.body.judul;
    const cover = req.body.cover;
    const materi = req.body.materi;
    const deskripsi = req.body.deskripsi;
    const idAkun = req.body.idAkun;
    const suka = "0";

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO materi (id,nama,materi,judul,deskripsi,suka,idAkun) values (?,?,?,?,?,?,?);';
         
        koneksi.query(querySql,[ id,nama,materi,judul,deskripsi,suka,idAkun], (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename;
        const cover =   imgsrc;
        const data = { ...req.body };
        const querySql = 'INSERT INTO materi (id,nama,cover,materi,judul,deskripsi,suka,idAkun) values (?,?,?,?,?,?,?,?);';
    
        koneksi.query(querySql,[ id,nama,cover,materi,judul,deskripsi,suka,idAkun], (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    }
});

app.get('/api/materi', (req, res) => {
    const querySql = 'SELECT * FROM materi';
    
    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
        res.status(200).json({ success: true, data: rows });
    });
});

app.put('/api/materiprofile/:idAkun', (req, res) => {
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM materi WHERE idAkun = ?';
    const idAkun = req.body.idAkun;
    
    koneksi.query(querySearch, req.params.idAkun, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
    
        if (rows.length) {
            res.status(200).json({ success: true, data: rows });
        } else {
            return res.status(404).json({ message: 'Ada kesalahan', error: err });
        }
    });
});

app.get('/api/materipopuler', (req, res) => {
    const querySql = 'SELECT * FROM materi WHERE suka>999';
    
    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
        res.status(200).json({ success: true, data: rows });
    });
});

app.put('/api/materiUbahSuka/:id', (req, res) => {
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM materi WHERE id = ?';
    const id = req.body.id;
    const suka = req.body.suka;
    
    const queryUpdate = 'UPDATE materi SET suka=? WHERE id = ?';

    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
    
        if (rows.length) {
            koneksi.query(queryUpdate, [suka, req.params.id], (err, rows, field) => {
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

app.put('/api/materi/:id', (req, res) => {
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM materi WHERE id = ?';
    const id = req.body.id;
    const nama = req.body.nama;
    const judul = req.body.judul;
    const materi = req.body.materi;
    const deskripsi = req.body.deskripsi;
    
    const queryUpdate = 'UPDATE materi SET nama=?,judul=?,materi=?,deskripsi=? WHERE id = ?';

    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
    
        if (rows.length) {
            koneksi.query(queryUpdate, [nama,judul,materi,deskripsi, req.params.id], (err, rows, field) => {
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

app.delete('/api/materi/:id', (req, res) => {
    const querySearch = 'SELECT * FROM materi WHERE id = ?';
    const queryDelete = 'DELETE FROM materi WHERE id = ?';

    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        if (rows.length) {
            koneksi.query(queryDelete, req.params.id, (err, rows, field) => {
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));