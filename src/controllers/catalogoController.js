const Catalogo = require('../models/catalogoModel');

exports.crearProductoCatalogo = async (req, res) => {
  try {
    const {
      id_producto,
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      imagen_principal_url,
      imagenes_adicionales_url,
      video_url,
    } = req.body;

    const nuevoProducto = await Catalogo.create({
      id_producto,
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      imagen_principal_url,
      imagenes_adicionales_url,
      video_url,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error creando producto de catálogo:", error);
    res.status(500).json({ error: "Error interno al crear producto" });
  }
};

exports.obtenerCatalogo = async (req, res) => {
  try {
    const productos = await Catalogo.findAll({ order: [['createdAt', 'DESC']] });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    res.status(500).json({ error: "Error interno al obtener catálogo" });
  }
};
