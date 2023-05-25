import { domainModel } from "../models/domain.js";

export const getDomainById = async (req, res) => {
    try {
        const { _id } = req.params
        const domain = await domainModel.findOne({ _id })
        return res.status(200).send({ success: true, message: "Domain", domain })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in domain lookup", error: error.message })
    }
}


export const getFilterDomain = async (req, res) => {
    try {
        const { name, topLevel, minPrice = 0, maxPrice = 1000000 } = req.query
        const query = {
            price: { $lte: maxPrice, $gte: minPrice }
        }
        if (name) {
            query.name = { $regex: '^' + name }
        }
        if (topLevel) {
            query.topLevel = topLevel
        }
        const domain = await domainModel.find(query).exec()
        return res.status(200).send({ success: true, domain })

    } catch (error) {
        return res.status(500).send({ success: false, message: "Error in search", error: error.message })
    }
}

