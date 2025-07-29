const Catalogo = require('../models/catalogoModel');

exports.crearProductoCatalogo = async (req, res) => {
  try {
    const {
      id_producto,
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria
    } = req.body;

    // Procesar archivos de Cloudinary desde req.files
    const imagenPrincipal = req.files?.imagenPrincipal?.[0]?.path || null;
    const imagenesAdicionales = req.files?.imagenesAdicionales?.map(f => f.path) || null;
    const video = req.files?.video?.[0]?.path || null;

    const nuevoProducto = await Catalogo.create({
      id_producto,
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      imagen_principal_url: imagenPrincipal,
      imagenes_adicionales_url: imagenesAdicionales,
      video_url: video
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
