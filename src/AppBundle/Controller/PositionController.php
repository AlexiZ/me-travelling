<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Position;
use AppBundle\Form\PositionType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class PositionController extends Controller
{
    public function positionListAction()
    {
        $parameters = [];
        $em = $this->get('doctrine.orm.entity_manager');
        $positions = $em->getRepository(Position::class)->findAll();
        $parameters = array_merge($parameters, ['positions' => $positions]);

        return $this->render('@App/Default/index.html.twig', $parameters);
    }

    public function positionAddAction(Request $request)
    {
        $parameters = [];
        $position = new Position();
        $em = $this->get('doctrine.orm.entity_manager');

        $form = $this->createForm(PositionType::class, $position, ['imagesDirectory' => $this->getParameter('images_directory')]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($position);
            $em->flush();

            $this->get('session')->getFlashBag()->add('success', 'Position successfully saved');
        }
        $parameters = array_merge($parameters, ['form' => $form->createView()]);

        return $this->render('@App/Position/new.html.twig', $parameters);
    }

    public function positionShowAction($id)
    {

    }
}
